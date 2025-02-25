@leftNavigationBar
Feature: Test set to check the left side menu items

    Background:
        Given user arrives on the Schul-Cloud homepage

    @adminTeacherClicksLeftMenuItems @e2eCore
    Scenario Outline: As a user, I want to be able to click the left menu items
        Given <userRole> logs in
        Then <userRole> clicks left navigation item 'logo'
        And <userRole> clicks left navigation item 'dashboard'
        And <userRole> clicks left navigation item 'courses'
        And <userRole> clicks left navigation item 'teams'
        And <userRole> clicks left navigation item 'homework'
        And <userRole> clicks left navigation item 'asked homework'
        And <userRole> clicks left navigation item 'private homework'
        And <userRole> clicks left navigation item 'archived homework'
        And <userRole> clicks left navigation item 'files'
        And <userRole> clicks left navigation item 'my files'
        And <userRole> clicks left navigation item 'course files'
        And <userRole> clicks left navigation item 'team files'
        And <userRole> clicks left navigation item 'shared files'
        And <userRole> clicks left navigation item 'news'
        And <userRole> clicks left navigation item 'calendar'
        #And <userRole> clicks left navigation item 'addons'
        And <userRole> clicks left navigation item 'administration'
        And <userRole> should see that all sub menu items are visible: '<tabsList>'
        And <userRole> clicks left navigation item 'helparea'
        And <userRole> clicks left navigation item 'helparticle'
        And <userRole> clicks left navigation item 'contact'
        # TODO nuxt pages - the navigation structure is different,
        #  therefor leave it for last page otherwise the other pages won't be found
        And <userRole> clicks left navigation item 'content'
        Examples:
            | userRole | tabsList                                           |
            | teacher  | SCHÜLER:INNEN, LEHRER:INNEN, KLASSEN               |
            | admin    | SCHÜLER, LEHRER, KURSE, KLASSEN, TEAMS, SCHULE     |

    @studentClicksLeftMenuItems
    Scenario Outline: As a user, I want to be able to click the left menu items
        Given student logs in
        Then <userRole> clicks left navigation item 'logo'
        And <userRole> clicks left navigation item 'dashboard'
        And <userRole> clicks left navigation item 'courses'
        And <userRole> clicks left navigation item 'teams'
        And <userRole> clicks left navigation item 'homework'
        And <userRole> clicks left navigation item 'asked homework'
        And <userRole> clicks left navigation item 'private homework'
        And <userRole> clicks left navigation item 'archived homework'
        And <userRole> clicks left navigation item 'files'
        And <userRole> clicks left navigation item 'my files'
        And <userRole> clicks left navigation item 'course files'
        And <userRole> clicks left navigation item 'team files'
        And <userRole> clicks left navigation item 'shared files'
        And <userRole> clicks left navigation item 'news'
        And <userRole> clicks left navigation item 'calendar'
        And <userRole> clicks left navigation item 'addons'
        And <userRole> clicks left navigation item 'helparea'
        And <userRole> clicks left navigation item 'helparticle'
        And <userRole> clicks left navigation item 'contact'
        # TODO nuxt pages - the navigation structure is different,
        #  therefor leave it for last page otherwise the other pages won't be found
        And <userRole> clicks left navigation item 'content'
        Examples:
            | userRole |
            | student  |
